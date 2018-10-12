type ignores = Js_re.t list

module Decoder = struct
  let decode raw_string = 
    let open Json.Decode in
    let json = Json.parseOrRaise raw_string in
    list string json
end

module Encoder = struct
  let encode items =
    let open Json.Encode in
    list string items
  let to_string = Json.stringify
end

let get_config_path () =
  let home = Sys.getenv "HOME" in
  Utils.add_to_route ".dlister" home

let get_config () =
  let path = get_config_path () in
  if File.exists path then
    File.read_file path |> Decoder.decode
  else
    (File.write_file path "[]"; []) 
