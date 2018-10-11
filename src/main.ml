let main () = 
	Arg.args () |> List.map (print_endline)

let _ = main ()