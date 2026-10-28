-- Keep the fixed client category set available for entity creation.
insert into public.entity_categories (slug, label)
values
  ('book', 'Books'),
  ('movie', 'Movies'),
  ('product', 'Products'),
  ('place', 'Places'),
  ('service', 'Services')
on conflict (slug) do update set label = excluded.label;
