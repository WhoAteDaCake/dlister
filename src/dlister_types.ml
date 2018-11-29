type action =
	| Add_ignores of string list
	| Rm_ignores of string list
	| Ls_ignores
	| Just of string
	| Pure
	| With of string
	| Run
	| Help
	| No_action

type path = string

type padding = int 

type command = action * path * padding

type tree = tree_entry list
	and tree_entry =
		| Leaf of string
		| Branch of string * tree

type ('a, 'b) result =
	| Ok of 'a
	| Error of 'b

exception ResultException of string

module Result = struct
	let ok = function
	| Ok(r) -> r 
	| _ -> raise (ResultException "Expected Ok, but received Error")

	let (>>=) a f = match a with
	| Ok(r) -> Ok (f r)
	| e -> e
end