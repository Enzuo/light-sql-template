WITH my_cte AS (
  SELECT
      *
    , 'some text'::TEXT
    , "column_name"
  FROM "my_table"
  WHERE ids IN({{= ids }})
)
, update_cte AS (
  UPDATE "my_table" SET
      "col1" = {{= col1 }}
  {{? col2 }}
    , "col2" = {{= col2 }}
  {{?}}
    , "col3" = {{= col3 }}
)
SELECT {{= col3 }} AS "final"
