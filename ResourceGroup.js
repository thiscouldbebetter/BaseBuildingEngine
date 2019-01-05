
function ResourceGroup(resources)
{
	this.resources = resources.addLookups("defnName");
}
{
	ResourceGroup.prototype.add = function(other)
	{
		return this.resourcesAdd(other.resources);
	}

	ResourceGroup.prototype.clear = function()
	{
		for (var i = 0; i < this.resources.length; i++)
		{
			var resource = this.resources[i];
			resource.quantity = 0;
		}
	}

	ResourceGroup.prototype.resourceAdd = function(resourceToAdd)
	{
		var defnName = resourceToAdd.defnName;
		var resourceToAddTo = this.resources[defnName];
		if (resourceToAddTo == null)
		{
			resourceToAddTo = new Resource(defnName, 0);
			this.resources.push(resourceToAddTo);
			this.resources[defnName] = resourceToAddTo;
		}
		resourceToAddTo.quantity += resourceToAdd.quantity;

		return this;
	}

	ResourceGroup.prototype.resourcesAdd = function(resourcesToAdd)
	{
		for (var i = 0; i < resourcesToAdd.length; i++)
		{
			var resource = resourcesToAdd[i];
			this.resourceAdd(resource);
		}

		return this;
	}
}
