let padded_message padding message = (String.make padding ' ') ^ message

module Tree = Dlister_tree

let run_safe (action, path, padding) = 
  let open Dlister_config in
  let config_path = get_config_path () in
  let config = get_config config_path in
  let show ?spacing:(sp="  ") ignores =
    let tree = Tree.read_dir_tree path (Tree.without ignores) in
    Tree.print padding tree sp in
  let open Dlister_types in
  match action with
  | Add_ignores(list) ->
    let full_config = Utils.uniq_list (config @ list) in
    let contents = Encoder.(encode full_config |> to_string) in
    File.write_file config_path contents;
    Ok ()
  | Rm_ignores(list) ->
    let new_config = Utils.disjunction config list in
    let contents = Encoder.(encode new_config |> to_string) in
    File.write_file config_path contents;
    Ok ()
  | Ls_ignores -> get_config_raw config_path |> print_endline; Ok ()
  | Just(expr) -> show (Utils.strings_to_re [expr]); Ok ()
  | Pure -> show []; Ok ()
  | With(expr) -> show (Utils.strings_to_re (expr::config)); Ok ()
  | Run -> show (Utils.strings_to_re config); Ok ()
  | _ -> Error "Unexpected action received"

let run (action, path, padding) =
  if File.exists path then
    run_safe (action, path, padding)
  else
    Error ("Invalid path provided")
