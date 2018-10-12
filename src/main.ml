open Dlister_types

let build_unknown_error command =
	"Command: " ^ command ^ " is unknown, please use --help to list the available commands"

let main () = 
	let arguments = Arg.args () in
	let route = ref (Sys.getcwd ()) in
	let action = ref No_action in
	let padding = ref 2 in
	let specs = [
		(
			"--add-ignore",
			Arg.Entries(fun items -> action := Add_ignores items),
			"Adds a given expression to ignore list"
		);
		(
			"--rm-ignore", 
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
			"Overlooks ignore list and only ignores given expression"
		);
		(
			"--with", 
			Arg.Pair(fun flag -> action := With flag), 
			"Joins given argument to the ignore list"
		);
		(
			"--so", 
			Arg.Single(fun flag -> padding := 4), 
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
	Arg.handle
		~when_anon:
			(fun path ->
				route := Utils.add_to_route path !route;
				action := Run
			)
		specs
		arguments;
	match !action with
		| No_action ->
			if List.length arguments = 0 then
				Dlister.run (Run, !route, !padding)
			else
				List.hd arguments |> build_unknown_error |> print_endline
		| Help -> Arg.print_spec specs 4 |> ignore
		| action -> Dlister.run (action, !route, !padding)

let _ = main ()