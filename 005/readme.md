# Flutter Basic
### Create widget
A widget is an element which can be used a again and again in same layout with different data variables, similar to function in scripts
```dart
class WidgetName extends StatelessWidget { // Widget definition
    final String variable; // variable data in widget i.e. perimeters

    // Default values
    const WidgetName({
        Key? key,
        this.variable = "Default Variable",
    }) : super(key: key);

    @override
    Widget build(BuildContext context) {
        return Container(
            // Your widget layout here
        )
}

// Call widget
body: Center (
    
)
```
### Container
a container is an element which is used to make the layout for the other elements and can have only one child element.
```dart
Container(
    width: 76, // width
    height: 120, // height
    margin: EdgetInsets.only(
        top: 8, // top margin
        left: 8, // left margin
        bottom: 8, // bottom margin
        right: 8, // right margin
    ),
    padding: EdgeInsets.only(
        top: 8, // top padding
        left: 8, // left padding
        bottom: 8, // bottom padding
        right: 8, // right padding
    ),

    decoration: BoxDecoration(
        color: Colors.grey, // backgrround color
        borderRadius: BorderRadius.circular(4), // corner radius
        image: DecorationImage(
            image: AssetImage("path/image.jpg"), // image
            fit: BoxFit.cover // image fit
            alignment: Alignment.topCenter
        ),
        border: Border(
            top: BorderSide( // top border
                color: Colors.black, // top border color
                width: 1, // top border width
            ),

        ),
        boxShadow: [
            BoxShadow(
                color: Colors.red,
                blurRadius: 20,
                spreadRadius: 0,
                offset: Offset(5, 5)
            ),
        ]
    )
    child: <widget>element
)
```
### Text paragraph
Text is used to create a paragraph of text with customization of whole text content.
```dart
Text(
    "My text paragraph",
    style: TextStyle(
        fontWeight: FontWeight.w400,
        fontSize: 14,
        color: Colors.black
    )
)
```
