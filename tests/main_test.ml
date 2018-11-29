open Jest
open Expect
open! Expect.Operators
open Dlister_types

let () = 
  describe "Dlister" (fun () ->
    describe "get_config" (fun () -> 
      test "should allow to specify if single argument is passed" (fun () ->
        let (_, route, _, _) = Main.get_config "/test" ["./test"] |> Result.ok in  
        expect route = "/test/test"
      );
      test "should to specify route using --path" (fun () ->
        let (_, route, _, _) = Main.get_config "/test" ["--path"; "./test"] |> Result.ok in  
        expect route = "/test/test"
      );
    )
  )