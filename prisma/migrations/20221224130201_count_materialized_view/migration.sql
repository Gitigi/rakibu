-- Create lines count materialized view
CREATE MATERIALIZED VIEW lines_count
AS
select count(*) from line;

-- Create words count materialized view
CREATE MATERIALIZED VIEW words_count
AS
select count(*) from word;

-- Create trigger for updating lines_count materialized view
CREATE OR REPLACE function f_update_lines_count_materialized_view() returns trigger
    language plpgsql
  AS
  $$
  begin
    REFRESH MATERIALIZED VIEW lines_count;

    RETURN new;
  end;
  $$;

CREATE OR REPLACE trigger tr_update_lines_count_materialized_view
  after insert or update or delete on line
    FOR EACH STATEMENT
      EXECUTE procedure f_update_lines_count_materialized_view();


-- Create trigger for updating words_count materialized view
CREATE OR REPLACE function f_update_words_count_materialized_view() returns trigger
    language plpgsql
  AS
  $$
  begin
    REFRESH MATERIALIZED VIEW words_count;
    
    RETURN new;
  end;
  $$;

CREATE OR REPLACE trigger tr_update_words_count_materialized_view
  after insert or update or delete on word
    FOR EACH STATEMENT
      EXECUTE procedure f_update_words_count_materialized_view();
