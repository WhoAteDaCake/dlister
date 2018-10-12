let padded_message padding message = (String.make padding ' ') ^ message

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
    | _ -> ()
