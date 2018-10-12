let read_file file =
  let open Node_fs in
  readFileSync file `utf8

let resolve = Node_path.resolve
let exists = Node_fs.existsSync

let write_file file contents =
  let open Node_fs in
  writeFileSync file contents `utf8 