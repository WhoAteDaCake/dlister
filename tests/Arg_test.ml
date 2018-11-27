open Jest
open Expect
open! Expect.Operators

let () = 
  describe "Arg" (fun () ->
    test "should work with single flag" (fun () ->
      let changed = ref false in
      let specs = [
        (
          "--so",
          Arg.Single(fun items -> changed := true),
          "Adds a given expression to ignore list"
        );
      ] in
      let args = ["--so"] in
      Arg.parse specs args;
      expect !changed = true
    );
    test "should work with a pair" (fun () ->
      let changed = ref None in
      let specs = [
        (
          "--so",
          Arg.Pair(fun value -> changed := Some value),
          "Adds a given expression to ignore list"
        );
      ] in
      let args = ["--so"; "test"] in
      Arg.parse specs args;
      expect !changed = (Some "test")
    );
    test "should work with entries" (fun () ->
      let changed = ref None in
      let specs = [
        (
          "--so",
          Arg.Entries(fun values -> changed := Some values),
          "Adds a given expression to ignore list"
        );
      ] in
      let args = ["--so"; "test"; "test2"] in
      Arg.parse specs args;
      expect !changed = (Some ["test"; "test2"])
    );
  )