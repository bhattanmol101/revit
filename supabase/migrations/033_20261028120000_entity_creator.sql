-- Existing entities have no reliable creator and remain unowned.
alter table public.entities
  add column created_by uuid references public.profiles (id) on delete set null;

alter table public.entities alter column created_by set default auth.uid();

grant delete on public.entities to authenticated;
create policy "Creators can delete entities"
  on public.entities for delete to authenticated
  using (created_by = (select auth.uid()));
