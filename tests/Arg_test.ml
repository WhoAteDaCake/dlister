open Jest
open Expect
open! Expect.Operators

let () = 
  describe "Fake Timers" (fun () ->
    test "runAllTimers" (fun () ->
      expect true = true
    );
  )