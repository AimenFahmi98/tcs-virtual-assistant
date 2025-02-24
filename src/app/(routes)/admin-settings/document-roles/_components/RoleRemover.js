import Spinner from "@/app/ui-components/Spinner";
import { FiMinus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDocumentSelection,
  stopSelectingDocuments,
  removeSelectedRolesFromSelectedDocuments,
  stopSelectingRolesToBeRemoved,
  toggleRemovalOfRole,
  clearRoleSelectionForRemoval,
  startSelectingRolesToBeRemoved,
  selectAllRolesForRemoval,
  setRolesToBeRemovedSearchQuery,
} from "@/redux/adminSlice";
import { IoMdSearch } from "react-icons/io";

function RoleRemover() {
  const dispatch = useDispatch();
  const {
    rolesToBeRemovedSearchQuery,
    currentDocId,
    selectedDocIds,
    rolesToBeRemoved,
    documentToRolesMap,
    isFetchingDocumentRoles,
    isRemovingRolesFromDocuments,
    isSelectingRolesToBeRemoved,
  } = useSelector((state) => state.admin);

  const filteredRoles =
    documentToRolesMap[currentDocId]?.length > 0
      ? documentToRolesMap[currentDocId].filter((role) =>
          role.name
            .toLowerCase()
            .includes(rolesToBeRemovedSearchQuery.toLowerCase()),
        )
      : [];

  const isAllRolesSelectedForRemoval =
    rolesToBeRemoved.length === filteredRoles.length;

  return (
    <div className="rounded-3xl bg-background p-6 shadow-md_custom">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Assigned Roles</h2>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              !isSelectingRolesToBeRemoved
                ? dispatch(startSelectingRolesToBeRemoved())
                : dispatch(stopSelectingRolesToBeRemoved());
              dispatch(clearRoleSelectionForRemoval());
            }}
            className="text-sm text-text_light hover:text-text"
          >
            {!isSelectingRolesToBeRemoved ? "Select" : "Cancel"}
          </button>
          {isSelectingRolesToBeRemoved && (
            <button
              onClick={() => {
                isAllRolesSelectedForRemoval
                  ? dispatch(clearRoleSelectionForRemoval())
                  : dispatch(selectAllRolesForRemoval());
              }}
              className="text-sm text-text_light hover:text-text"
            >
              {isAllRolesSelectedForRemoval ? "Deselect All" : "Select All"}
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <IoMdSearch className="h-6 w-6 text-gray-400" />
        <input
          type="text"
          placeholder="Search roles..."
          value={rolesToBeRemovedSearchQuery}
          onChange={(e) =>
            dispatch(setRolesToBeRemovedSearchQuery(e.target.value))
          }
          className="w-full bg-background text-text placeholder:text-gray-400 focus:outline-none"
        />
      </div>
      <div className="mb-4 transform border-b-2 border-primary"></div>

      {selectedDocIds.length > 0 && rolesToBeRemoved.length > 1 && (
        <button
          onClick={() => {
            dispatch(removeSelectedRolesFromSelectedDocuments());
            dispatch(stopSelectingRolesToBeRemoved());
            dispatch(stopSelectingDocuments());
            dispatch(clearDocumentSelection());
          }}
          className={`mb-4 w-full rounded-xl bg-primary p-3 text-sm font-medium hover:bg-primary_dark`}
          disabled={isRemovingRolesFromDocuments}
        >
          {isRemovingRolesFromDocuments ? (
            <Spinner size="26px" borderSize="3px" />
          ) : (
            "Remove Selected Roles"
          )}
        </button>
      )}

      <div className="max-h-40 min-h-40 space-y-2 overflow-y-auto">
        {isFetchingDocumentRoles || !documentToRolesMap[currentDocId] ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : filteredRoles.length > 0 ? (
          filteredRoles.map((role) => (
            <div
              key={role.id}
              onClick={() => {
                if (isSelectingRolesToBeRemoved) {
                  dispatch(toggleRemovalOfRole(role.id));
                }
              }}
              className={`flex w-full items-center justify-between rounded-xl bg-primary_light p-3 hover:cursor-pointer hover:bg-primary ${
                rolesToBeRemoved.includes(role.id) &&
                "bg-red-100 hover:bg-red-100"
              } ${
                isRemovingRolesFromDocuments &&
                rolesToBeRemoved.includes(role.id) &&
                "animate-pulse"
              }`}
            >
              <div className="flex items-center gap-2">
                {isSelectingRolesToBeRemoved && (
                  <input
                    type="checkbox"
                    checked={rolesToBeRemoved.includes(role.id)}
                    onChange={() => {}}
                    className="h-3 w-3"
                  />
                )}
                <h4 className="text-sm font-medium">{role.name}</h4>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(clearRoleSelectionForRemoval());
                  dispatch(toggleRemovalOfRole(role.id));
                  dispatch(removeSelectedRolesFromSelectedDocuments());
                  dispatch(clearDocumentSelection());
                  dispatch(stopSelectingRolesToBeRemoved());
                  dispatch(stopSelectingDocuments());
                }}
                disabled={
                  isRemovingRolesFromDocuments &&
                  rolesToBeRemoved.includes(role.id)
                }
              >
                {isRemovingRolesFromDocuments &&
                rolesToBeRemoved.includes(role.id) ? (
                  <Spinner size="24px" borderSize="3px" />
                ) : (
                  <FiMinus className="h-6 w-6" />
                )}
              </button>
            </div>
          ))
        ) : (
          <p>No roles assigned</p>
        )}
      </div>
    </div>
  );
}

export default RoleRemover;
