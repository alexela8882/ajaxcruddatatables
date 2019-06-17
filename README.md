AjaxCrudDataTables - Version 1.0 (README)

CRUD USAGE: C-reate

1. This function uses Laravel validation. All you need to do is pass the validation error into json response.
2. Pass the data as Laravel collection in a json response when data is validated.
3. Define "data-operator" in table to pass operator buttons when appending the newly added data.
4. Pass args: table & modal to the plugin.
5. Make sure columns in the dataTables match the query from controller.
6. Make sure the name of inputs in the add form match the column from database.
7. Always get the id of the table when passing response from controller.

## Example implementation

### index.blade.php

    @extends('layouts.app')

    @section('title', 'Companies')

    @section('content')
    <div class="content-wrapper">
      <section class="content-header">
        <h1>
          Companies
          <small>Manage companies</small>
        </h1>
        <ol class="breadcrumb">
          <li><a href="{{ route('home') }}"><i class="fa fa-dashboard"></i> Home</a></li>
          <li class="active">Companies</li>
        </ol>
      </section>

      <section class="content">
        <div class="row mt-4 mb-4">
          <div class="col-md-12">
            <div class="box">
              <div class="box-header with-border">
                <h3 class="box-title">
                  Companies
                </h3>
              </div>
              <div class="box-body table-responsive">
                @include ('errors.list')
                @include ('successes.list')
                <table class="table table-bordered table-hover"
                      id="company-table"
                      data-operators='[{"url":"{{route('company.edit',['id'=>':id'])}}","text":"Edit","icon":"fa fa-pencil"},{"url":"{{route('company.trash',['id'=>':id'])}}","text":"Delete","icon":"fa fa-trash"}]'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @foreach ($companies as $index => $company)
                      <tr>
                        <td>{{ $company->id }}</td>
                        <td>{{ $company->name }}</td>
                        <td>{{ $company->address }}</td>
                        <td>{{ $company->contact }}</td>
                        <td>{{ $company->email }}</td>
                        <td></td>
                      </tr>
                    @endforeach
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal -->
    <div id="company-modal" class="modal fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">ADD COMPANY</h4>
          </div>

          <form method="post"
                action="{{ route("company.store-ajax") }}">
            <div class="modal-body">
              <div class="form-group">
                <label>Name:</label>
                <input type="text" class="form-control" name="name">
              </div>

              <div class="form-group">
                <label>Addess:</label>
                <input type="text" class="form-control" name="address">
              </div>

              <div class="form-group">
                <label>Contact:</label>
                <input type="text" class="form-control" name="contact">
              </div>

              <div class="form-group">
                <label>Email:</label>
                <input type="email" class="form-control" name="email">
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    @stop

    @push('scripts')
    <script>
      $(function () {
        var companyTable = $('#company-table');
        var table = $(companyTable).DataTable({
              'paging'      : true,
              'lengthChange': true,
              'searching'   : true,
              'ordering'    : true,
              'info'        : true,
              'select'      : true,
              'responsive'  : true,
              'scrollY'     : "300px",
              'columns': [
                  { "data": "id" },
                  { "data": "name" },
                  { "data": "address" },
                  { "data": "contact" },
                  { "data": "email" },
                  { "data": null,
                    render: function ( data, type, row ) {
                      var operators = $(companyTable).data('operators');
                      var buttons = ''; // operator buttons holder
                      for(var i = 0; i < operators.length; i++) {
                        var operator = operators[i];
                        var url = operator.url;
                            url = operator.url.replace(':id', data.id);
                        buttons += '<div class="btn-group">'+
                                      '<a href="'+url+'" class="btn btn-default btn-xs" title="'+operator.text+'"><i class="'+operator.icon+'"></i></a>';
                      }
                      return buttons;
                    }
                  },
              ],
              dom: "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" +
                  "<'row'<'col-sm-12'tr>>" +
                  "<'row'<'col-sm-5'i><'col-sm-7'p>>",
              columnDefs: [
                { targets: [0], visible: true },
              ],
              lengthMenu: [
                  [ 10, 25, 50, -1 ],
                  [ '10', '25', '50', '100', 'All' ]
              ],
              buttons: [
                {
                  text: 'Add',
                  action: function (e, node, config){
                    $('#company-modal').modal('show');
                  }
                }, {
                  extend: 'excelHtml5',
                  exportOptions: {
                    columns: ':visible'
                  }
                },
                'colvis'
              ]
            });

        // AjaxCrudDataTables
        $('#company-table').AjaxCrudDataTables({
          table : table,
          modal : $('#company-modal'),
        });
      });
    </script>
    @endpush
    
### CompanyController.php

    // AJAX STORE
    public function store_ajax (Request $req) {
      $validator = Validator::make($req->all(), [
        'name' => 'required|unique:companies,name',
        'address' => 'required',
      ]);

      if ($validator->fails()) {
        return response()->json(['validator' => $validator->errors()], 422);
      }

      $company = new Company;
      $company->name = $req->name;
      $company->address = $req->address;
      $company->contact = $req->contact;
      $company->email = $req->email;
      $company->save();

      // get currently saved data
      // $response = Company::where('id', $company->id)
      // ->select('id', 'name', 'address', 'contact', 'email')->first();

      // or get from request
      $req['id'] = $company->id; // insert id first
      $response = $req->all();

      return response()->json(['response' => $response], 200);
    }
