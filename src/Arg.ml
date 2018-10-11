(* Idea *)

exception No_arguments of string

type spec =
 | Single of (bool -> unit)
 | Pair of (string -> unit)
 | Entries of (string list -> unit)

type flag =
  | Single_Flag of bool option
  | Pair_Flag of string option
  | Entries_Flag of (string list) option

type config = string * spec * string

let args () = Array.to_list (Utils.from_nth 2 Sys.argv)

let rec find_flags key flag args = match args with
  | [] -> flag
  | hd :: [] ->
    if not (hd == key) then
      flag
    else
      let result = match flag with
        | Single_Flag(_) -> Single_Flag (Some true)
        | _ -> flag in
      result
  | hd :: value :: rest ->
    if not (hd == key) then
      find_flags key flag (value :: rest)
    else match flag with
      | Single_Flag(_) -> Single_Flag (Some true)
      | Pair_Flag(_) -> Pair_Flag (Some value)
      | Entries_Flag(ls_opt) ->
        let new_entries = match ls_opt with
          | None -> [value]
          | Some(ls) -> value :: ls in
        (* If we need to maintain order acc @ [value] should be used or list should be reversed after *)
        find_flags key (Entries_Flag (Some new_entries)) rest      


let handle_spec args config = 
  let (key, spec, _) = config in
  match spec with
    | Single(fn) ->
      (match find_flags key (Single_Flag None) args with
        | Single_Flag(Some(value)) -> fn(value)
        | _ -> ()
      )
    | Pair(fn) ->
      (match find_flags key (Pair_Flag None) args with
        | Pair_Flag(Some(value)) -> fn(value)
        | _ -> ()
      )
    | Entries(fn) -> 
      (match find_flags key (Entries_Flag None) args with
        | Entries_Flag(Some(value)) -> fn(value)
        | _ -> ()
      )

let parse specs args = List.map (handle_spec args) specs

let print_spec specs spaces = List.map
  (fun spec -> 
      let (key, _, message) = spec in
      print_endline key;
      print_endline ((String.make spaces ' ') ^ message)
  ) specs

(* TODO implement a check whether the command actually exists in spec *)
let handle ?(spaces=4) ~when_anon specs args =
  if List.length args == 1 then
    match List.hd args with
      | "help" | "--help" -> 
        print_spec specs spaces |> ignore;
        false
      | str ->
        (
          if String.get str 0 == '-' then
            parse specs args |> ignore
          else 
            when_anon str
        );
        true
  else
    (parse specs args |> ignore; true)