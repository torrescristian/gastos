export default interface QueryUseCase<RES, FILTERS = undefined> {
  execute(props: FILTERS): Promise<RES>;
}
