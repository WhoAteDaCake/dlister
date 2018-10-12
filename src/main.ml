
let main () = 
	let includes = ref [] in
	let base_route = ref (Fpath.v (Sys.getcwd ())) in
	let specs = [
		("--i", Arg.Entries(fun items -> includes := items), "Include items");
		("--a", Arg.Entries(fun items -> includes := items), "Include a items")
	] in
	let continue = Arg.handle
		~when_anon:(fun path ->
			base_route := Fpath.append !base_route (Fpath.v path) )
		specs
		(Arg.args ()) in
	if not continue then 
		()
	else 
		print_endline (Fpath.to_string !base_route)

let _ = main ()