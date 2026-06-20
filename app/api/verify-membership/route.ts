
 
 const createProject = async (
  projectType?: ProjectTypeKey
) => {
  if (!identifier.trim()) {
    alert("Please enter your email address or phone number")
    return
  }

  try {
    const response = await fetch("/api/profile/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
      }),
    })

    const result = await response.json()

    if (!result.found) {
      localStorage.setItem(
        "pending_identifier",
        identifier
      )

      window.location.href = "/business-profile"
      return
    }

    const profile = result.profile

    if ((profile.estimatesUsed ?? 0) === 0) {
      startProject(projectType ?? null)
      return
    }

    const verifyResponse = await fetch(
      "/api/verify-membership",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
        }),
      }
    )

    const membership =
      await verifyResponse.json()

    if (membership.access === "paid") {
      startProject(projectType ?? null)
      return
    }

    alert("Create a Business Account")
  } catch (error) {
    console.error(error)
    alert("Unable to verify account")
  }
}

