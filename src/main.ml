
let main () = 
	let includes = ref [] in
	let base_route = ref (Sys.getcwd ()) in
	let route = Fpath.v !base_route in
	let specs = [
		("--i", Arg.Entries(fun items -> includes := items), "Include items");
		("--a", Arg.Entries(fun items -> includes := items), "Include a items")
	] in
	let continue = Arg.handle
		~when_anon:(fun path ->
			base_route := Filename.realpath (Filename.concat !base_route path) )
		specs
		(Arg.args ()) in
	if not continue then 
		()
	else 
		print_endline !base_route

let _ = main ()