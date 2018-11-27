let from_nth n array = Array.sub array n (Array.length array - n)

let add_to_route path route = File.resolve route path

let uniq_list lst =
  let unique_set = Hashtbl.create (List.length lst) in
  List.iter (fun x -> Hashtbl.replace unique_set x ()) lst;
  Hashtbl.fold (fun x () xs -> x :: xs) unique_set []

let disjunction list remove =
  Belt.List.keep list (fun item -> not (Belt.List.has remove item (==)))

let strings_to_re items = Belt.List.map items Js.Re.fromString

let first_char str = String.get str 0

let rec find_opt fn = function
  | [] -> None
  | x :: xs -> if fn x then Some x else find_opt fn xs 

let rec take_while_aux fn ls = function
| [] -> (List.rev ls, [])
| x :: xs ->
  if fn x then
    take_while_aux fn (x :: ls) xs
  else
    (List.rev ls, x :: xs) 

let take_while fn xs = take_while_aux fn [] xs