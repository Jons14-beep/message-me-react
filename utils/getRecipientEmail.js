export const getRecipientEmail = (users, userLoggedIn) => {
  return users?.filter((email) => {
    return email !== userLoggedIn?.email
  })[0];
}
