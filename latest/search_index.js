var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#ODBC.jl-1",
    "page": "Home",
    "title": "ODBC.jl",
    "category": "section",
    "text": "The ODBC.jl package provides high-level julia functionality over the low-level ODBC API middleware. In particular, the package allows making connections with any database that has a valid ODBC driver, sending SQL queries to those databases, and streaming the results into a variety of data sinks."
},

{
    "location": "index.html#ODBC.listdsns()-1",
    "page": "Home",
    "title": "ODBC.listdsns()",
    "category": "section",
    "text": "Lists pre-configured DSN datasources available to the user. Note that DSNs are \"bit-specific\", meaning a 32-bit DSN setup with the 32-bit ODBC system admin console will only be accessible through 32-bit julia."
},

{
    "location": "index.html#ODBC.listdrivers-1",
    "page": "Home",
    "title": "ODBC.listdrivers",
    "category": "section",
    "text": "Lists valid ODBC drivers on the system which can be used manually in connection strings in the form of Driver={ODBC Driver Name}; as a key-value pair. Valid drivers are read from the system ODBC library, which can be seen by calling ODBC.API.odbc_dm. This library is \"detected\" automatically when the ODBC.jl package is loaded, but can also be set by calling ODBC.API.setODBC(\"manual_odbc_lib\")."
},

{
    "location": "index.html#ODBC.DSN-1",
    "page": "Home",
    "title": "ODBC.DSN",
    "category": "section",
    "text": "Constructors:ODBC.DSN(dsn, username, password) => ODBC.DSNODBC.DSN(connection_string; prompt::Bool=true) => ODBC.DSNODBC.disconnect!(dsn::ODBC.DSN)The first method attempts to connect to a pre-defined DSN that has been pre-configured through your system's ODBC admin console. Settings such as the ODBC driver, server address, port #, etc. are already configured, so all that is required is the username and password to connect.The second method takes a full connection string. Connection strings are vendor-specific, but follow the format of key1=value1;key2=value2... for various key-value pairs, typically including Driver=X and Server=Y. For help in figuring out how to build the right connection string for your system, see connectionstrings.com. There is also a prompt keyword argument that indicates whether a driver-specific UI window should be shown if there are missing connection string key-value pairs needed for connection. If being run non-interactively, set prompt=false.ODBC.disconnect!(dsn) can also be used to disconnect."
},

{
    "location": "index.html#ODBC.query-1",
    "page": "Home",
    "title": "ODBC.query",
    "category": "section",
    "text": "Methods:ODBC.query(dsn::ODBC.DSN, sql::AbstractString, sink=DataFrame, args...; weakrefstrings::Bool=true, append::Bool=false)ODBC.query{T}(dsn::DSN, sql::AbstractString, sink::T; weakrefstrings::Bool=true, append::Bool=false)ODBC.query(source::ODBC.Source, sink=DataFrame, args...; append::Bool=false)ODBC.query{T}(source::ODBC.Source, sink::T; append::Bool=false)ODBC.query is a high-level method for sending an SQL statement to a system and returning the results. As is shown, a valid dsn::ODBC.DSN and SQL statement sql combo can be sent, as well as an already-constructed source::ODBC.Source. By default, the results will be returned in a DataFrame, but a variety of options exist for returning results, including CSV.Sink, SQLite.Sink, or Feather.Sink. ODBC.query actually utilizes the DataStreams.jl framework, so any valid Data.Sink can be used to return results. The append=false keyword specifies whether the results should be added to any existing data in the Data.Sink, or if the resultset should fully replace any existing data. The weakrefstrings argument indicates whether WeakRefStrings should be used by default for efficiency.Examples:dsn = ODBC.DSN(valid_dsn)\n\n# return result as a DataFrame\ndf = ODBC.query(dsn, \"select * from cool_table\")\n\n# return result as a csv file\nusing CSV\ncsv = ODBC.query(dsn, \"select * from cool_table\", CSV.Sink, \"cool_table.csv\")\n\n# return the result directly into a local SQLite table\nusing SQLite\ndb = SQLite.DB()\n\nsqlite = ODBC.query(dsn, \"select * from cool_table\", SQLite.Sink, db, \"cool_table_in_sqlite\")\n\n# return the result as a feather-formatted binary file\nusing Feather\nfeather = ODBC.query(dsn, \"select * from cool_table\", Feather.Sink, \"cool_table.feather\")\n"
},

{
    "location": "index.html#ODBC.load-1",
    "page": "Home",
    "title": "ODBC.load",
    "category": "section",
    "text": "Methods: ODBC.load{T}(dsn::DSN, table::AbstractString, ::Type{T}, args...; append::Bool=false)ODBC.load(dsn::DSN, table::AbstractString, source; append::Bool=false)ODBC.load{T}(sink::Sink, ::Type{T}, args...; append::Bool=false)ODBC.load(sink::Sink, source; append::Bool=false)ODBC.load is a sister method to ODBC.query, but instead of providing a robust way of returning results, it allows one to send data to a DB.Please note this is currently experimental and ODBC driver-dependent; meaning, an ODBC driver must impelement certain low-level API methods to enable this feature. This is not a limitation of ODBC.jl itself, but the ODBC driver provided by the vendor. In the case this method doesn't work for loading data, please see the documentation around prepared statements.ODBC.load takes a valid DB connection dsn and the name of an existing table table to which to send data. Note that on-the-fly creation of a table is not currently supported. The data to send can be any valid Data.Source object, from the DataStreams.jl framework, including a DataFrame, CSV.Source, SQLite.Source, Feather.Source, etc.Examples:dsn = ODBC.DSN(valid_dsn)\n\n# first create a remote table\nODBC.execute!(dsn, \"CREATE TABLE cool_table (col1 INT, col2 FLOAT, col3 VARCHAR)\")\n\n# load data from a DataFrame into the table\ndf = DataFrame(col1=[1,2,3], col2=[4.0, 5.0, 6.0], col3=[\"hey\", \"there\", \"sailor\"])\n\nODBC.load(dsn, \"cool_table\", df)\n\n# load data from a csv file\nusing CSV\n\nODBC.load(dsn, \"cool_table\", CSV.Source, \"cool_table.csv\")\n\n# load data from an SQLite table\nusing SQLite\n\nODBC.load(dsn, \"cool_table\", SQLite.Source, \"select * from cool_table\")\n\n# load data from a feather-formatted binary file\nusing Feather\n\nODBC.load(dsn, \"cool_table\", Feather.Source, \"cool_table.feather\")\n"
},

{
    "location": "index.html#ODBC.prepare-1",
    "page": "Home",
    "title": "ODBC.prepare",
    "category": "section",
    "text": "Methods:ODBC.prepare(dsn::ODBC.DSN, querystring::String) => ODBC.StatementPrepare an SQL statement querystring against the DB and return it as an ODBC.Statement. This ODBC.Statement can then be executed once, or repeatedly in a more efficient manner than ODBC.execute!(dsn, querystring). Prepared statements can also support parameter place-holders that can be filled in dynamically before executing; this is a common strategy for bulk-loading data or other statements that need to be bulk-executed with changing simple parameters before each execution. Consult your DB/vendor-specific SQL syntax for the exact specifications for parameters.Examples:# prepare a statement with 3 parameters marked by the '?' character\nstmt = ODBC.prepare(dsn, \"INSERT INTO cool_table VALUES(?, ?, ?)\")\n\n# a DataFrame with data we'd like to insert into a table\ndf = DataFrame(col1=[1,2,3], col2=[4.0, 5.0, 6.0], col3=[\"hey\", \"there\", \"sailor\"])\n\nfor row = 1:size(df, 1)\n    # each time we execute the `stmt`, we pass another row to be bound to the parameters\n    ODBC.execute!(stmt, [df[row, x] for x = 1:size(df, 2)])\nend"
},

{
    "location": "index.html#ODBC.execute!-1",
    "page": "Home",
    "title": "ODBC.execute!",
    "category": "section",
    "text": "Methods:ODBC.execute!(dsn::ODBC.DSN, querystring::String)ODBC.execute!(stmt::ODBC.Statement)ODBC.execute!(stmt::ODBC.Statement, values)ODBC.execute! provides a method for executing a statement against a DB without returning any results. Certain SQL statements known as \"DDL\" statements are used to modify objects in a DB and don't have results to return anyway. While ODBC.query can still be used for these types of statements, ODBC.execute! is much more efficient. This method is also used to execute prepared statements, as noted in the documentation for ODBC.prepare."
},

{
    "location": "index.html#ODBC.Source-1",
    "page": "Home",
    "title": "ODBC.Source",
    "category": "section",
    "text": "Constructors:ODBC.Source(dsn::ODBC.DSN, querystring::String) => ODBC.SourceODBC.Source is an implementation of a Data.Source in the DataStreams.jl framework. It takes a valid DB connection dsn and executes a properly formatted SQL query string querystring and makes preparations for returning a resultset."
},

]}
