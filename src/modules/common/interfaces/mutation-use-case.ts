export default interface MutationUseCase<T, RES = void> {
  execute(props: T): Promise<RES>;
}
