export function createBlankProject(
  type: ProjectTypeKey | null = null
): Project {
  ...
}
const startProject = () => {
  setCurrent(createBlankProject())
}
