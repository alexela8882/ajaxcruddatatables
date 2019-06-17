AjaxCrudDataTables - Version 1.0 (README)

CRUD USAGE: C-reate

1. This function uses Laravel validation. All you need to do is pass the validation error into json response.
2. Pass the data as Laravel collection in a json response when data is validated.
3. Define "data-operator" in table to pass operator buttons when appending the newly added data.
4. Pass args: table & modal to the plugin.
5. Make sure columns in the dataTables match the query from controller.
6. Make sure the name of inputs in the add form match the column from database.
7. Always get the id of the table when passing response from controller.