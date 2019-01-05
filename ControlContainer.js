
function ControlContainer(name, children, hasBorder)
{
	this.name = name;
	this.children = children;
	this.hasBorder = (hasBorder == null ? true : hasBorder);

	for (var i = 0; i < this.children.length; i++)
	{
		var child = this.children[i];
		child.parent = this;
	}
}

{
	ControlContainer.prototype.domElementUpdate = function(display)
	{
		var children = this.children;

		if (this._domElement == null)
		{
			this._domElement = document.createElement("div");
			if (this.hasBorder == true)
			{
				this._domElement.style.border = "1px solid";
			}

			for (var i = 0; i < children.length; i++)
			{
				var child = children[i];
				var childDomElement = child.domElementUpdate(display);
				this._domElement.appendChild(childDomElement);
			}
		}

		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.domElementUpdate(display);
		}

		return this._domElement;
	}
 }
