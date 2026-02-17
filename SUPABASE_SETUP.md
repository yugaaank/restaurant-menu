
-- RESTAURANTS TABLE
create table restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  cuisine text not null,
  address text not null,
  image text,
  is_open boolean default true,
  created_at timestamp with time zone default now()
);

-- MENU ITEMS TABLE
create table menu_items (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  image text,
  is_available boolean default true,
  created_at timestamp with time zone default now()
);

-- ORDERS TABLE
create table orders (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id),
  customer_name text not null,
  customer_phone text not null,
  address text not null,
  note text,
  total_amount numeric(10,2) not null,
  status text default 'pending'
    check (status in (
      'pending','confirmed','preparing',
      'out_for_delivery','delivered','cancelled'
    )),
  created_at timestamp with time zone default now()
);

-- ORDER ITEMS TABLE
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  name text not null,
  price numeric(10,2) not null,
  quantity integer not null,
  created_at timestamp with time zone default now()
);

-- ENABLE ROW LEVEL SECURITY (allow all for now, no auth)
alter table restaurants enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Allow all" on restaurants for all using (true);
create policy "Allow all" on menu_items for all using (true);
create policy "Allow all" on orders for all using (true);
create policy "Allow all" on order_items for all using (true);

/*
INSTRUCTIONS:
1. Go to supabase.com → New Project
2. Go to SQL Editor → paste the SQL above → Run
3. Go to Project Settings → API
4. Copy: Project URL and anon public key
5. Paste into server/.env as shown below
*/
