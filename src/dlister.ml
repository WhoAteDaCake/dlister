let padded_message padding message = (String.make padding ' ') ^ message

module Tree = Dlister_tree

let run (action, path, padding) = 
  let open Dlister_config in
  let config_path = get_config_path () in
  let config = get_config config_path in
  let open Dlister_types in
  match action with
    | Add_ignores(list) ->
      let full_config = Utils.uniq_list (config @ list) in
      let contents = Encoder.(encode full_config |> to_string) in
      File.write_file config_path contents
    | Rm_ignores(list) ->
      let new_config = Utils.disjunction config list in
      let contents = Encoder.(encode new_config |> to_string) in
      File.write_file config_path contents
    | Ls_ignores ->
      get_config_raw config_path |> print_endline
    (* | Just(expr) ->
      print_endline "Match" *)
    | Run ->
      let expressions = Utils.strings_to_re config in
      let tree = Tree.read_dir_tree path (Tree.without expressions) in
      ()
    | _ -> print_endline "Matched none";
