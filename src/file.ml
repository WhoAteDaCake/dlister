type stats

external stats_sync: string -> stats  = "statSync" [@@bs.val] [@@bs.module "fs"]
external is_directory : stats -> bool = "isDirectory" [@@bs.send]

let is_dir path = stats_sync path |> is_directory

let read_file file =
  let open Node_fs in
  readFileSync file `utf8

let resolve = Node_path.resolve
let exists = Node_fs.existsSync

let write_file file contents =
  let open Node_fs in
  writeFileSync file contents `utf8 

let read_dir dir = Node_fs.readdirSync dir |> Belt.List.fromArray