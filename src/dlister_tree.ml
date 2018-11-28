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

let format_file pf symbol str = (pf ^ symbol ^ line ^ str)

(* sp - spacing, pf - prefix *)
let rec print_tree tree sp pf =
  match (tree) with
  | [] -> ()
  | x::[] -> print_entry x corner sp pf
  | x::xs -> print_entry x branch sp pf; print_tree xs sp pf
  and print_entry entry symbol sp pf =
  match (entry) with
  | Leaf(str) -> format_file pf symbol str |> print_endline
  | Branch(str, tree) ->
    let next_prefix = if symbol == branch then column else " " in
    format_file pf symbol str |> print_endline;
    print_tree tree sp (pf ^ next_prefix ^ sp)

let print padding tree indent = print_tree tree indent padding