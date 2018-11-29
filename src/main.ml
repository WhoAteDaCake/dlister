open Dlister_types

let get_config default_route arguments =
	let route = ref (default_route) in
	let action = ref No_action in
	let padding = ref "" in
	let specs = [
		(
			"--add",
			Arg.Entries(fun items -> action := Add_ignores items),
			"Adds a given expression to ignore list"
		);
		(
			"--remove", 
			Arg.Entries(fun items -> action := Rm_ignores items), 
			"Removes given expressions from ignore list"
		);
		(
			"--list", 
			Arg.Single(fun _flag -> action := Ls_ignores
		), 
			"Lists current ignore list");
		(
			"--just", 
			Arg.Pair(fun flag -> action := Just flag), 
			"Overlooks ignore list and only ignores given expression"
		);
		(
			"--pure", 
			Arg.Pair(fun _flag -> action := Pure), 
			"Overlooks ignore list completely"
		);
		(
			"--with", 
			Arg.Pair(fun flag -> action := With flag), 
			"Joins given argument to the ignore list"
		);
		(
			"--so", 
			Arg.Single(fun _flag -> padding := "    "), 
			"Adds left padding of 4 spaces"
		);
		(
			"--path", 
			Arg.Pair(fun flag -> route := Utils.add_to_route flag !route; action := Run ), 
			"Specifies the path to be ran from"
		);
		(
			"--help", 
			Arg.Single(fun _flag ->	action := Help ), 
			"Lists all available commands"
		);
	] in
	let result = Arg.handle ~when_anon:
		(fun path ->
			route := Utils.add_to_route path !route;
			action := Run
		) specs arguments in
	match result with
	| Ok () -> Ok (!action, !route, !padding, specs)
	| Error(msg) -> Error msg

let run () = match get_config (Sys.getcwd ()) (Arg.args ()) with
| Error(err) -> print_endline err 
| Ok ((action, route, padding, specs)) -> 
	let result = match action with
	| No_action -> Dlister.run (Run, route, padding)
	| Help -> (Arg.print_spec specs 4 |> ignore; Ok ())
	| action -> Dlister.run (action, route, padding) in
	match (result) with
	| Ok () -> ()
	| Error(msg) -> print_endline msg
