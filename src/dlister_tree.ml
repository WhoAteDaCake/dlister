open Dlister_types

let without ignores list =
  Belt.List.keep list (fun entry ->
    not (Belt.List.has ignores entry (fun exp entry -> 
      Js.Re.test entry exp)))

let rec read_dir_tree path is_valid = 
  let entries = File.read_dir path |> is_valid in
  Belt.List.map entries (fun entry ->
    let full_path = Utils.add_to_route entry path in
    if File.is_dir full_path then
      Branch (read_dir_tree full_path is_valid)
    else Leaf (full_path))
