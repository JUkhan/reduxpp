export function createAction(type: string) {
  return (payload: any) => {
    return { type, payload };
  };
}
