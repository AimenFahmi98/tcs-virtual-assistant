import Spinner from "@/app/ui-components/common/Spinner";
import { FiPlus } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedRolesToSelectedDocuments,
  clearDocumentSelection,
  clearRoleSelectionForAssignment,
  selectAllRolesForAssignment,
  setRolesToBeAssignedSearchQuery,
  startSelectingRolesToBeAssigned,
  stopSelectingDocuments,
  stopSelectingRolesToBeAssigned,
  toggleAssignmentOfRole,
} from "@/redux/adminSlice";

function RoleAssigner() {
  const dispatch = useDispatch();
  const {
    currentDocId,
    selectedDocIds,
    roles,
    rolesToBeAssignedSearchQuery,
    rolesToBeAssigned,
    isSelectingRolesToBeAssigned,
    documentToRolesMap,
    isFetchingDocumentRoles,
    isAddingRolesToDocuments,
  } = useSelector((state) => state.admin);
  const { currentUser: user } = useSelector((state) => state.users);

  const filteredRoles = roles.filter((role) =>
    role.name
      .toLowerCase()
      .includes(rolesToBeAssignedSearchQuery.toLowerCase()),
  );

  const availableRoles = filteredRoles?.filter(
    (role) =>
      !documentToRolesMap[currentDocId]?.some((dr) => dr.id === role.id),
  );

  const isAllRolesSelectedForAssignment =
    rolesToBeAssigned.length === availableRoles.length;

  return (
    <div className="rounded-3xl bg-background p-6 shadow-md_custom">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Roles</h2>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              !isSelectingRolesToBeAssigned
                ? dispatch(startSelectingRolesToBeAssigned())
                : dispatch(stopSelectingRolesToBeAssigned());

              dispatch(clearRoleSelectionForAssignment());
            }}
            className="text-sm text-text_light hover:text-text"
          >
            {!isSelectingRolesToBeAssigned ? "Select" : "Cancel"}
          </button>
          {isSelectingRolesToBeAssigned && (
            <button
              onClick={() => {
                isAllRolesSelectedForAssignment
                  ? dispatch(clearRoleSelectionForAssignment())
                  : dispatch(selectAllRolesForAssignment());
              }}
              className="text-sm text-text_light hover:text-text"
            >
              {isAllRolesSelectedForAssignment ? "Deselect All" : "Select All"}
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <IoMdSearch className="h-6 w-6 text-gray-400" />
        <input
          type="text"
          placeholder="Search roles..."
          value={rolesToBeAssignedSearchQuery}
          onChange={(e) =>
            dispatch(setRolesToBeAssignedSearchQuery(e.target.value))
          }
          className="w-full bg-background text-text placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      <div className="mb-4 transform border-b-2 border-primary"></div>
      <div className="space-y-4">
        {selectedDocIds.length > 0 && rolesToBeAssigned.length > 1 && (
          <button
            onClick={() => {
              dispatch(addSelectedRolesToSelectedDocuments(user.id));
              dispatch(stopSelectingRolesToBeAssigned());
              dispatch(stopSelectingDocuments());
              dispatch(clearDocumentSelection());
            }}
            className={`w-full rounded-xl bg-primary p-3 font-medium hover:bg-primary_dark`}
            disabled={isAddingRolesToDocuments}
          >
            {isAddingRolesToDocuments ? (
              <Spinner size="26px" borderSize="3px" />
            ) : (
              "Assign Selected Roles"
            )}
          </button>
        )}

        <div className="max-h-[220px] min-h-[220px] space-y-2 overflow-y-auto">
          {isFetchingDocumentRoles ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : availableRoles.length > 0 ? (
            availableRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => {
                  if (isSelectingRolesToBeAssigned) {
                    dispatch(toggleAssignmentOfRole(role.id));
                  }
                }}
                className={`flex w-full items-center justify-between rounded-xl bg-primary_light p-3 hover:bg-primary ${isSelectingRolesToBeAssigned && rolesToBeAssigned.includes(role.id) && "bg-green-200 hover:bg-green-200"} ${
                  isAddingRolesToDocuments &&
                  rolesToBeAssigned.includes(role.id) &&
                  "animate-pulse"
                } ${isSelectingRolesToBeAssigned && "cursor-pointer"}`}
              >
                <div className="flex items-center gap-2">
                  {isSelectingRolesToBeAssigned && (
                    <input
                      type="checkbox"
                      checked={rolesToBeAssigned.includes(role.id)}
                      onChange={() => {}}
                      className="h-3 w-3"
                    />
                  )}
                  <h4 className="text-sm font-medium">{role.name}</h4>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(clearRoleSelectionForAssignment());
                    dispatch(toggleAssignmentOfRole(role.id));
                    dispatch(addSelectedRolesToSelectedDocuments());
                    dispatch(clearDocumentSelection());
                    dispatch(stopSelectingRolesToBeAssigned());
                    dispatch(stopSelectingDocuments());
                  }}
                  disabled={
                    isAddingRolesToDocuments &&
                    rolesToBeAssigned.includes(role.id)
                  }
                >
                  {isAddingRolesToDocuments &&
                  rolesToBeAssigned.includes(role.id) ? (
                    <Spinner size="24px" borderSize="3px" />
                  ) : (
                    <FiPlus className="h-6 w-6" />
                  )}
                </button>
              </div>
            ))
          ) : (
            <p>No roles available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleAssigner;
