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