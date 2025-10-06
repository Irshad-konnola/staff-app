import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
  } from "@gorhom/bottom-sheet";
  import React from "react";
  
  export const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={0} // When the BottomSheet is closed
      appearsOnIndex={1} // When the BottomSheet is open
      opacity={0.7} // Custom backdrop opacity (for a dark backdrop)
    />
  );
  