let padded_message padding message = (String.make padding ' ') ^ message

let run (action, path, padding) = 
  let config = Dlister_config.get_config () in
  let open Dlister_types in
  match action with
    | Add_ignores(list) ->
      let full_config = Utils.uniq_list (config @ list) in
      ()
    | _ -> ()
