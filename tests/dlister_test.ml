open Jest
open Expect
open! Expect.Operators
open Dlister_types

let () = 
  describe "Dlister" (fun () ->
    test "passed path should be validated" (fun () ->
      let result = Dlister.run (Run, "#", "") in
      expect result = Error "Invalid path provided"
    );
  )