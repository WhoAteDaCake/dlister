let from_nth n array = Array.sub array n (Array.length array - n)

let add_to_route path route = File.resolve route path

let uniq_list lst =
  let unique_set = Hashtbl.create (List.length lst) in
  List.iter (fun x -> Hashtbl.replace unique_set x ()) lst;
  Hashtbl.fold (fun x () xs -> x :: xs) unique_set []

let disjunction list remove =
  Belt.List.keep list (fun item -> not (Belt.List.has remove item (==)))

let strings_to_re items = Belt.List.map items Js.Re.fromString