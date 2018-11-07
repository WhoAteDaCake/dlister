open Dlister_types

(* const visuals = {
  corner: "└",
  line: "─",
  column: "│",
  branch: "├",
  tabSize: 2
}; *)
let corner = {js|└|js}
let line   = {js|─|js}
let column = {js|│|js}
let branch = {js|├|js}

let without ignores list =
  Belt.List.keep list (fun entry ->
    not (Belt.List.has ignores entry (fun exp entry -> 
      Js.Re.test entry exp)))

let rec read_dir_tree path is_valid = 
  let entries = File.read_dir path |> is_valid in
  Belt.List.map entries (fun entry ->
    let full_path = Utils.add_to_route entry path in
    if File.is_dir full_path then
      Branch (entry, read_dir_tree full_path is_valid)
    else Leaf (entry))

(* let print_aux tree il iw = match (tree) with  *)
let build_prefix il iw symbol = (String.make (il * iw) ' ') ^ symbol

let rec print_tree tree il iw =
  match (tree) with
  | [] -> ()
  | x::[] -> print_entry x corner il iw
  | x::xs -> print_entry x branch il iw; print_tree xs il iw
  and print_entry entry symbol il iw =
  match (entry) with
  | Leaf(str) -> print_endline ((build_prefix il iw symbol) ^ line ^ "" ^ str)
  | Branch(str, tree) ->
    print_endline ((build_prefix il iw symbol)  ^ line ^ "" ^ str); print_tree tree (il + 1) iw

(* let rec print_tree tree il iw = Belt.List.map(tree, ) and
  print_entry  *)