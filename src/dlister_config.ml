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

let get_config_raw path =
  if File.exists path then
    File.read_file path
  else
    (File.write_file path "[]"; "[]") 

let get_config path = get_config_raw path |> Decoder.decode
