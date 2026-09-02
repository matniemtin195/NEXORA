-- NEXORA V3: sync for the EXISTING Supabase project.
-- Your current project already has categories/products/profiles/orders/order_items/wallet_transactions.
-- This migration adds the missing topup flow and atomic wallet purchase/approval RPCs.
create extension if not exists pgcrypto;
create table if not exists public.topups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount bigint not null check (amount > 0),
  transfer_code text unique not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  provider_ref text,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);
alter table public.topups enable row level security;
drop policy if exists "topups own read" on public.topups;
create policy "topups own read" on public.topups for select to authenticated using (user_id=(select auth.uid()) or public.is_admin());
drop policy if exists "topups own insert" on public.topups;
create policy "topups own insert" on public.topups for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists "topups admin update" on public.topups;
create policy "topups admin update" on public.topups for update to authenticated using (public.is_admin()) with check (public.is_admin());
create or replace function public.approve_topup(p_topup_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare t public.topups;
begin
  if (select auth.uid()) is null or not public.is_admin() then raise exception 'not authorized'; end if;
  select * into t from public.topups where id=p_topup_id for update;
  if t.id is null then raise exception 'topup not found'; end if;
  if t.status <> 'pending' then return; end if;
  update public.topups set status='approved',approved_at=now() where id=t.id;
  update public.profiles set balance=balance+t.amount where id=t.user_id;
  insert into public.wallet_transactions(user_id,amount,type,note) values(t.user_id,t.amount,'topup','Nạp tiền '||t.transfer_code);
end; $$;
create or replace function public.create_order(p_product_id uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare p public.products; uid uuid=(select auth.uid()); oid uuid;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select * into p from public.products where id=p_product_id and active=true for update;
  if p.id is null then raise exception 'product unavailable'; end if;
  if p.stock<=0 then raise exception 'out of stock'; end if;
  update public.profiles set balance=balance-p.price where id=uid and balance>=p.price;
  if not found then raise exception 'insufficient balance'; end if;
  update public.products set stock=stock-1 where id=p.id;
  insert into public.orders(user_id,total,status) values(uid,p.price,'paid') returning id into oid;
  insert into public.order_items(order_id,product_id,product_name,price,quantity) values(oid,p.id,p.name,p.price,1);
  insert into public.wallet_transactions(user_id,amount,type,note) values(uid,-p.price,'purchase','Mua sản phẩm: '||p.name);
  return oid;
end; $$;
revoke execute on function public.approve_topup(uuid) from anon;
revoke execute on function public.create_order(uuid) from anon;
grant execute on function public.approve_topup(uuid) to authenticated;
grant execute on function public.create_order(uuid) to authenticated;
create index if not exists products_active_created_idx on public.products(active,created_at desc);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists orders_user_created_idx on public.orders(user_id,created_at desc);
create index if not exists topups_user_created_idx on public.topups(user_id,created_at desc);
create index if not exists wallet_transactions_user_created_idx on public.wallet_transactions(user_id,created_at desc);
