
let main () = 
	let includes = ref [] in
	let base_route = ref (Sys.getcwd ()) in
	let specs = [
		("--i", Arg.Entries(fun items -> includes := items), "Include items");
		("--a", Arg.Entries(fun items -> includes := items), "Include a items")
	] in
	Arg.handle ~when_anon:(print_endline) specs (Arg.args ());
	print_endline !base_route

let _ = main ()