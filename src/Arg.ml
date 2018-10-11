(* Idea *)

type spec =
 | Bool of (bool -> unit)
 | List of (string list -> unit)
 | String of (string -> unit)

let args () = Array.to_list (Utils.from_nth 2 Sys.argv)

(* let parse = specs *)