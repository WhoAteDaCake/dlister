type action =
	| Add_ignores of string list
	| Rm_ignores of string list
	| Ls_ignores
	| Just of string
	| Pure
	| With of string
	| Run
	| Help
	| No_action

type path = Fpath.t

type padding = int 

type command = action * path * padding
(* 
	--add-ignores : Adds a given expression to ignore list
	--rm-ignores : Removes given expressions from ignore list
	--list : Lists current ignore list
	--just : Overlooks ignore list and only ignores given expression
	--pure : Overlooks ignore list
	--with : Joins given argument to the ignore list
	--so : Adds left padding of 4 spaces
	--path: Specifies the path to be ran from.
 *)

let build_unknown_error command =
	"Command: " ^ command ^ " is unknown, please use --help to list the available commands"

let add_to_route path route =
	let open Fpath in
	let full_route = append route (v path) in
	normalize full_route

let run (action, path, padding) = 
	print_endline (Fpath.to_string path)

let main () = 
	let arguments = Arg.args () in
	let route = ref (Fpath.v (Sys.getcwd ())) in
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
			Arg.Pair(fun flag ->	route := add_to_route flag !route; action := Run ), 
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
				route := add_to_route path !route;
				action := Run
			)
		specs
		arguments;
	match !action with
		| No_action ->
			if List.length arguments = 0 then
				run (Run, !route, !padding)
			else
				List.hd arguments |> build_unknown_error |> print_endline
		| Help -> Arg.print_spec specs 4 |> ignore
		| action -> run (action, !route, !padding)

let _ = main ()