(* Idea *)

open Dlister_types

exception No_arguments of string

type action =
 | Single of (bool -> unit)
 | Pair of (string -> unit)
 | Entries of (string list -> unit)

type specs = string * action * string

let args () = Array.to_list (Utils.from_nth 2 Sys.argv)

let not_found_msg flag = "Could not find flag: " ^ flag ^ ", maybe try using --help ?"
let missing_value flag = "Missing value for flag: " ^ flag

let is_not_flag x = Utils.first_char x <> '-'

let find_spec flag = Utils.find_opt (fun (key, _, _) -> key = flag)

let rec parse specs = function
  | [] -> Ok ()
  | flag :: xs ->
    match find_spec flag specs with
    | None -> Error (not_found_msg flag)
    | Some(spec) -> 
      let (_, action, _) = spec in
      match action with
      | Single(fn) -> fn true; parse specs xs
      | Pair(fn) -> 
        (
          match xs with
          | [] -> Error (missing_value flag)
          | x :: xs -> fn x; parse specs xs
        )
      | Entries(fn) ->
        let (entries, xs) = Utils.take_while is_not_flag xs in
        fn entries;
        parse specs xs
        

let print_spec specs spaces =
  let prefix = String.make spaces ' ' in
  List.map
    (fun spec -> 
        let (key, _, message) = spec in
        print_endline key;
        print_endline (prefix ^ message)
    ) specs

(* TODO: handle the parse return type *)
let handle ~when_anon specs = function
  | x :: [] ->
    if is_not_flag x then
      (when_anon x; Ok ())
    else
      parse specs [x]
  | args -> parse specs args