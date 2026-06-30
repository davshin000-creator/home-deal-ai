export const motionPresets = {
  card: "transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]",
  button: "transition duration-200 ease-out active:scale-[0.99]",
  overlay: "animate-in fade-in duration-200",
  dialog: "animate-in fade-in zoom-in-95 duration-200",
  drawerRight: "animate-in slide-in-from-right duration-200",
  drawerLeft: "animate-in slide-in-from-left duration-200",
  page: "animate-in fade-in slide-in-from-bottom-2 duration-300",
} as const;
