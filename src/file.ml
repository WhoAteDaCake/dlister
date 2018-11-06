
type stats = <
  isDirectory: unit -> bool [@bs.meth]
> Js.t

external stats_sync: string -> stats  = "statSync" [@@bs.val] [@@bs.module "fs"]

let is_dir path =
  let stats = stats_sync path in  
  stats##isDirectory ()


let read_file file =
  let open Node_fs in
  readFileSync file `utf8

let resolve = Node_path.resolve
let exists = Node_fs.existsSync

let write_file file contents =
  let open Node_fs in
  writeFileSync file contents `utf8 

let read_dir dir = Node_fs.readdirSync dir |> Belt.List.fromArray